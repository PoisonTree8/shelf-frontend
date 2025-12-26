const BASE_URL = `${import.meta.env.VITE_API_URL}/ratings`;

export async function getBookRatings(bookId) {
  const res = await fetch(`${BASE_URL}/book/${bookId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch ratings');
  }

  return res.json();
}

export async function addRating(bookId, ratingValue) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ratingValue }),
  });

  if (!res.ok) {
    let message = 'Failed to add rating';
    try {
      const data = await res.json();
      message = data.err || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}
