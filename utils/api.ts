// utils/api.ts
export const API_BASE_URL = "http://localhost:8078"; // 后端 API 地址

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
  auth?: boolean; // 是否需要 Token 认证
};

export async function apiFetch<T>(
  endpoint: string,
  { method = "GET", headers = {}, body, auth = false }: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // 默认请求头
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 如果需要 Token 认证
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      (defaultHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      // 处理 HTTP 错误
      const errorData = await response.json();
      throw new Error(errorData.message || "API 请求失败");
    }

    return response.json() as Promise<T>; // 返回解析后的数据
  } catch (error) {
    console.error(`API 请求错误: ${error}`);
    throw error; // 让调用方处理错误
  }
}