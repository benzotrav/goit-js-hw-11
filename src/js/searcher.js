import axios from 'axios';
const URL = 'https://pixabay.com/api/';
const API_KEY = '27515523-9dca8758fab0b717270f23e63';

const params = {
            q: '',
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: 1,
            per_page: 40,
            key: API_KEY,
}
const customAxios = axios.create({
    baseURL: URL
});
const getPicters = async () => {
    try {
        const res = await customAxios.get('', { params })
       
        return res;
        
    } catch {
        console.log('message');
    }
}
export default {params, getPicters}

