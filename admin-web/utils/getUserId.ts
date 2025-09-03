// utils/getUserId.ts
export function getUserId() {
    let id = localStorage.getItem("userId");
    if (!id) {
        id = crypto.randomUUID(); // generate a new one
        localStorage.setItem("userId", id);
    }
    return id;
}
