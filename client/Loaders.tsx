//fetch initial userData upon page load and pass to dashboard and metric display components
export const userLoader = async () => {
  const res = await fetch('/api/user', {
    method: 'GET',
  });
  return res.json();
};
