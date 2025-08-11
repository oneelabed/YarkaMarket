export default async function deleteListing(id) {
    return fetch(`http://localhost:8080/my-listings/${id}`, {
        method: "DELETE"
    });
}