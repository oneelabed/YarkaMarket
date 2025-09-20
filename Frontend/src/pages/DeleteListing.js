export default async function deleteListing(id) {
    const apiUrl = process.env.REACT_APP_API_URL;
    
    return fetch(`${apiUrl}/my-listings/${id}`, {
        method: "DELETE"
    });
}