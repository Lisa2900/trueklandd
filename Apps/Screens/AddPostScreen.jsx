import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, KeyboardAvoidingView } from "react-native";
import { app } from "../../firebaseConfig";
import { collection, getDocs, getFirestore, addDoc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { getAuth } from "firebase/auth";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';

const uploadImageToCloudinary = async (uri) => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'image/jpeg',
            name: 'photo.jpg',
        });
        formData.append('upload_preset', 'gwuqvmne');

        const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dnljjoq2n/image/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const imageUrl = response.data.secure_url;
        return imageUrl;
    } catch (error) {
        console.error("Error al subir la imagen a Cloudinary:", error);
        throw error;
    }
};

export default function AddPostScreen() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const db = getFirestore(app);
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser);
        getCategoryList();
    }, []);

    const getCategoryList = async () => {
        const querySnapshot = await getDocs(collection(db, "Category"));
        const categories = querySnapshot.docs.map(doc => doc.data());
        setCategoryList(categories);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted' || cameraStatus.status !== 'granted') {
            Alert.alert('Permiso necesario', 'Se requiere acceso a la cámara y a la galería de imágenes.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            if (images.length < 3) {
                setImages([...images, result.assets[0].uri]);
            } else {
                Alert.alert("Límite de imágenes", "Puedes subir hasta 3 imágenes.");
            }
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permiso necesario', 'Se requiere acceso a la cámara.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            if (images.length < 3) {
                setImages([...images, result.assets[0].uri]);
            } else {
                Alert.alert("Límite de imágenes", "Puedes subir hasta 3 imágenes.");
            }
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onSubmitMethod = async (values, setFieldValue) => {
        setLoading(true);

        try {
            values.productId = values.productId || "";
            values.title = values.title || "";
            values.desc = values.desc || "";
            values.category = values.category || "";
            values.cambio = values.cambio || "";
            values.telefono = values.telefono || "";
            values.location = values.location || "";
            values.images = values.images || [];

            const imageUrls = await Promise.all(images.map(image => uploadImageToCloudinary(image)));
            values.images = imageUrls;
            values.userName = user.displayName || "Anónimo";
            values.userEmail = user.email;
            values.userImage = user.photoURL || "";

            const userPostRef = await addDoc(collection(db, "UserPost"), {
                title: values.title,
                desc: values.desc,
                category: values.category,
                cambio: values.cambio,
                telefono: values.telefono,
                images: values.images,
                location: values.location || "",
                userName: values.userName,
                userEmail: values.userEmail,
                userImage: values.userImage,
                createdAt: moment().format("D MMM YYYY"),
                isAuthorized: false,
            });

            await updateDoc(userPostRef, { productId: userPostRef.id });

            await addDoc(collection(db, "Status"), {
                Color: "#fff",
                IdProduct: userPostRef.id,
                IdUser: user.email,
                Status: "En proceso",
                createdAt: moment().format("D MMM YYYY")
            });

            setLoading(false);
            Alert.alert("¡Éxito!", "Publicación agregada. Espera la autorización de un administrador.");
            setFieldValue("title", "");
            setFieldValue("desc", "");
            setFieldValue("category", "");
            setFieldValue("cambio", "");
            setFieldValue("telefono", "");
            setFieldValue("location", "");
            setImages([]);
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
            Alert.alert("Error", "Hubo un problema al agregar la publicación. Inténtalo de nuevo.");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.heading}>Añadir Artículo</Text>
                    <Text style={styles.subHeading}>Crear Nueva Publicación e Iniciar Trueque</Text>
                    <Formik
                        initialValues={{
                            title: "",
                            desc: "",
                            category: "",
                            cambio: "",
                            telefono: "",
                            images: [],
                            location: "",
                            userName: "",
                            userEmail: "",
                            userImage: "",
                            createdAt: moment().format("D MMM YYYY")
                        }}
                        onSubmit={(values, { setFieldValue }) => onSubmitMethod(values, setFieldValue)}
                        validate={(values) => {
                            const errors = {};

                            if (!values.title) {
                                errors.title = "Debes insertar un nombre.";
                            }

                            if (!values.desc) {
                                errors.desc = "Debes insertar una descripción.";
                            }

                            if (!values.category) {
                                errors.category = "Debes seleccionar una categoría.";
                            }

                            if (!values.cambio) {
                                errors.cambio = "Debes indicar qué deseas a cambio.";
                            }

                            if (!values.telefono) {
                                errors.telefono = "Debes insertar un número de teléfono.";
                            } else if (values.telefono.length !== 10) {
                                errors.telefono = "El número de teléfono debe tener 10 dígitos.";
                            }

                            if (images.length === 0) {
                                errors.images = "Debes seleccionar al menos una imagen.";
                            }

                            return errors;
                        }}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                        }) => (
                            <View>
                                <TouchableOpacity onPress={takePhoto} style={styles.button}>
                                    <Text style={styles.buttonText}>Tomar Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickImage} style={styles.button}>
                                    <Text style={styles.buttonText}>Seleccionar Imagen</Text>
                                </TouchableOpacity>
                                <View style={styles.imageContainer}>
                                    {images.length > 0 ? (
                                        images.map((image, index) => (
                                            <View key={index} style={styles.imageWrapper}>
                                                <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                                                    <Icon name="times" size={20} color="#fff" />
                                                </TouchableOpacity>
                                                <Image source={{ uri: image }} style={styles.image} />
                                            </View>
                                        ))
                                    ) : (
                                        <Image source={require("../../assets/images/imagen.png")} style={styles.image} />
                                    )}
                                </View>
                                <Text style={styles.infoText}>Toca en la imagen para agregar más.</Text>
                                {errors.images && touched.images && (
                                    <Text style={styles.errorText}>{errors.images}</Text>
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre"
                                    value={values.title}
                                    onChangeText={handleChange("title")}
                                    onBlur={handleBlur("title")}
                                />
                                {errors.title && touched.title && (
                                    <Text style={styles.errorText}>{errors.title}</Text>
                                )}

                                <View style={styles.categoryContainer}>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={values.category}
                                            onValueChange={(itemValue) => setFieldValue("category", itemValue)}
                                        >
                                            <Picker.Item label="Selecciona una categoría" value="" />
                                            {categoryList.map((cat, index) => (
                                                <Picker.Item key={index} label={cat.name} value={cat.name} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                {errors.category && touched.category && (
                                    <Text style={styles.errorText}>{errors.category}</Text>
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Descripción"
                                    multiline
                                    numberOfLines={4}
                                    value={values.desc}
                                    onChangeText={handleChange("desc")}
                                    onBlur={handleBlur("desc")}
                                />
                                {errors.desc && touched.desc && (
                                    <Text style={styles.errorText}>{errors.desc}</Text>
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Qué deseas a cambio"
                                    value={values.cambio}
                                    onChangeText={handleChange("cambio")}
                                    onBlur={handleBlur("cambio")}
                                />
                                {errors.cambio && touched.cambio && (
                                    <Text style={styles.errorText}>{errors.cambio}</Text>
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Número de teléfono"
                                    keyboardType="numeric"
                                    value={values.telefono}
                                    onChangeText={handleChange("telefono")}
                                    onBlur={handleBlur("telefono")}
                                />
                                {errors.telefono && touched.telefono && (
                                    <Text style={styles.errorText}>{errors.telefono}</Text>
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Ubicación"
                                    value={values.location}
                                    onChangeText={handleChange("location")}
                                    onBlur={handleBlur("location")}
                                />

                                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                    <Text style={styles.buttonText}>{loading ? <ActivityIndicator size="small" color="#fff" /> : "Agregar Publicación"}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        flexGrow: 1,
    },
    card: {
        padding: 20,
        margin: 10,
        borderRadius: 8,
        backgroundColor: "#f8f8f8",
        elevation: 3,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    imageWrapper: {
        position: "relative",
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "#ff0000",
        borderRadius: 50,
        padding: 5,
    },
    infoText: {
        fontSize: 14,
        color: "#888",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
});
