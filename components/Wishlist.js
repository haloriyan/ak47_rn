import AsyncStorage from "@react-native-async-storage/async-storage";

const Wishlist = {
    get: function () {
        let datas = [];
        AsyncStorage.getItem('wishlist').then(value => {
            if (value != null) {
                datas = JSON.parse(value);
            }
        });
        return datas;
    },
    set: function (id) {
        let datas = [];
        AsyncStorage.getItem('wishlist').then(value => {
            if (value != null) {
                datas = JSON.parse(value);
            }
            let i = datas.indexOf(id);
            if (i >= 0) {
                datas.splice(i, 1);
            } else {
                datas.push(id);
            }
            AsyncStorage.setItem('wishlist', JSON.stringify(datas));
        });
    },
    has: async function (id) {
        try {
            let datas = await AsyncStorage.getItem('wishlist');
            if (datas !== null) {
                datas = JSON.parse(datas);
                let i = datas.indexOf(id);
                return i >= 0 ? true : false;
            }
            return false;
        } catch (err) {
            console.error(err)
        }
        
    }
}

export default Wishlist;