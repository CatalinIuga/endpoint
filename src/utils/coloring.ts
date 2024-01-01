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

export { coloredHttpMethod };
