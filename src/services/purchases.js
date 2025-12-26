const BASE_URL = 'http://localhost:3000/purchases';

export async function buyBook(bookId) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/${bookId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    status: 'demo',
  }),
});

 if (!res.ok) {
  let message = 'Purchase failed';
  try {
    const data = await res.json();
    message = data.err || message;
  } catch (_) {}
  throw new Error(message);
}

  return res.json();
}

export async function checkPurchase(bookId) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/check/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to check purchase');
  }

  return res.json(); // { purchased: true/false }
}

export async function deleteBook(bookId) {
  const token = localStorage.getItem('token');

  const res = await fetch(`http://localhost:3000/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete book');
  }

  return res.json();
}
