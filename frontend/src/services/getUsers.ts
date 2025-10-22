export default async function getUsers() {
  const res = await fetch("/users");
  const data = await res.json();
  return data;
}
