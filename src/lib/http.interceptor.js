const API_BASE_URL = "/api";

// Function to get data with authorization
export const getData = async (endpoint, token) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const res = await response.json();
  return res;
}

// Function to post data with authorization
export const postData = async (endpoint, data, token) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const res = await response.json();
  return res;
}
