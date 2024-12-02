import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { Entypo } from '@expo/vector-icons';

export default function ItemList() {
    const { params } = useRoute();
    const db = getFirestore(app);
    const [itemList, setItemList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params) {
            getItemListByCategory();
        }
    }, [params]);

    const getItemListByCategory = async () => {
        setLoading(true);
        setItemList([]);
        try {
            const q = query(
                collection(db, 'UserPost'),
                where('category', '==', params.Category),
                where('isAuthorized', '==', true) // Filtro para mostrar solo artículos autorizados
            );
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItemList(items);
        } catch (error) {
            console.error("Error fetching items: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                <Text style={{ fontSize: 20, color: 'gray' }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            {itemList.length > 0 ? (
                <LatestItemList latestItemList={itemList} heading={''} />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: 'gray', padding: 16 }}>
                        ¡Aún no se ha subido ningún artículo!
                    </Text>
                    <Entypo name="emoji-sad" size={100} color="gray" />
                </View>
            )}
        </View>
    );
}
