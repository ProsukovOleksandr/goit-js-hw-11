import axios from 'axios';
export async function fetchData(input, page, limit) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=37512295-7e92ae3b8c2d51cd4aec1f8a1&q=${input}&
      image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
