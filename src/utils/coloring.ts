function coloredHttpMethod(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return `text-green-400`;
    case "POST":
      return `text-orange-400`;
    case "HEAD":
      return `text-indigo-400`;
    case "PUT":
      return `text-yellow-400`;
    case "DELETE":
      return `text-red-400`;
    case "PATCH":
      return `text-purple-400`;
    case "OPTIONS":
      return `text-cyan-400`;
    case "TRACE":
      return `text-blue-400`;
    default:
      return `text-pink-400`;
  }
}

function coloredHttpStatus(status: number) {
  if (status >= 200 && status < 300) {
    return `text-green-400`;
  } else if (status >= 300 && status < 400) {
    return `text-yellow-400`;
  } else if (status >= 400 && status < 500) {
    return `text-orange-400`;
  } else if (status >= 500 && status < 600) {
    return `text-red-400`;
  } else {
    return `text-pink-400`;
  }
}

export { coloredHttpMethod, coloredHttpStatus };
