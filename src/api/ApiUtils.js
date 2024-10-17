export async function extractDataFromError(error) {
  const { response } = error || {}
  return (await response?.data) || {}
}
