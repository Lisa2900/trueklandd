export default function UserProfileScreen() {
  const nav = useNavigation();
  const { params } = useRoute();
  const { image, name, email } = params;
  const db = getFirestore(app);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProducts();
  }, []);

  const fetchUserProducts = async () => {
    try {
      const q = query(collection(db, 'UserPost'), where('userEmail', '==', email));
      const snapshot = await getDocs(q);
      const userProducts = snapshot.docs.map(doc => doc.data());
      setProducts(userProducts);
    } catch (error) {
      console.error("Error al obtener los productos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => nav.navigate('product-detail', { product: item })} 
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
        <EvilIcons name="chevron-left" size={40} color="#333" />
      </TouchableOpacity>

      <Image source={image} style={styles.profileImage} />
      <Text style={styles.userName}>{name}</Text>

      <View style={{ marginTop: 30, width: '100%' }}>
        <Text style={styles.sectionTitle}>Productos publicados</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.productList}
          />
        ) : (
          <Text style={styles.noProductsText}>Este usuario no ha publicado productos aún.</Text>
        )}
      </View>
    </View>
  );
}
