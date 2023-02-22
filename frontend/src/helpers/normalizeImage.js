const normalizeImage = (url) => {
  const afterUrl = url.replace(/^.*[\\\/]/, '/static/media/')
  return afterUrl
}

export default normalizeImage