export default async ({ route, body }) =>
  fetch(`http://localhost:4000/${route}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: window.localStorage.getItem('jwt') ? `Bearer ${window.localStorage.getItem('jwt')}` : null,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
