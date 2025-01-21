import { IMAGE_API } from "@/constants/api";

const generation = async (idToken: string, name: string, input: any) => {
  const response = await fetch(IMAGE_API.GENERATION, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, input }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

const modify = async (idToken: string, id: string, input: any) => {
  const response = await fetch(IMAGE_API.GENERATION + `/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

const editRequestName = async (
  idToken: string,
  requestId: string,
  name: string
) => {
  const response = await fetch(IMAGE_API.REQUESTS + `/${requestId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (response.status !== 201) {
    throw Error(data);
  }
  return data;
};

const deleteRequest = async (idToken: string, requestId: string) => {
  const response = await fetch(IMAGE_API.REQUESTS + `/${requestId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 204) {
    throw Error("Failed to delete data");
  }
  return;
};

export default generation;
export { modify, editRequestName, deleteRequest };
