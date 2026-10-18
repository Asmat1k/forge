const inp = document.getElementById('inp');
document.getElementById('bt').addEventListener('click', async () => {
  try {
    const response = await fetch(inp.value);
    if (!response.ok) return
    inp.value = await response.text();
  } catch (e) {
    // ignore
  }
});
