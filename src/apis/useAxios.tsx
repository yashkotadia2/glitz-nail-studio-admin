"use client";
import { useCallback } from "react";
import axios, { AxiosResponse } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Params = Record<string, string>;

const useAxiosAPI = () => {
  const COMMON_HEADERS = {
    "Content-Type": "application/json",
  };

  const FORM_DATA_HEADERS = {
    "Content-Type": "multipart/form-data",
  };

  const getData = useCallback(
    async <T = unknown,>(
      url: string,
      id: string | number | Array<string | number> | null = null,
      params?: Params
    ): Promise<T> => {
      try {
        // Construct the base URL
        let fullUrl = `${BASE_URL}${url}`;

        // Check if id is provided
        if (id) {
          if (Array.isArray(id)) {
            // Join array elements into a single string separated by slashes
            fullUrl = `${fullUrl}/${id.join("/")}`;
          } else {
            // Use id directly if it's a string or number
            fullUrl = `${fullUrl}/${id}`;
          }
        }

        // Append the params object as a query string if provided
        if (params && typeof params === "object") {
          const queryString = new URLSearchParams(params).toString();
          fullUrl = `${fullUrl}?${queryString}`;
        }

        // Make the GET request with the full URL
        const response: AxiosResponse<T> = await axios.get(fullUrl, {
          headers: COMMON_HEADERS,
        });

        // Return the response data
        return response.data;
      } catch (error) {
        console.error("Error with GET request:", error);
        throw error;
      }
    },
    []
  );

  const postData = useCallback(
    async <T = unknown,>(
      url: string,
      data: Record<string, unknown> | FormData = {}
    ): Promise<T> => {
      const isFormData = data instanceof FormData;

      try {
        const response: AxiosResponse<T> = await axios.post(
          `${BASE_URL}${url}`,
          data,
          {
            headers: isFormData ? FORM_DATA_HEADERS : COMMON_HEADERS,
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error with POST request:", error);
        throw error;
      }
    },
    []
  );

  const putData = useCallback(
    async <T = unknown,>(
      url: string,
      ids: string | number | Array<string | number> | null = null,
      data: Record<string, unknown> | FormData = {}
    ): Promise<T> => {
      try {
        // Determine if `ids` is an array or a single value and append appropriately
        const idsPath = Array.isArray(ids) ? ids.join("/") : ids ? ids : "";

        // Construct the final URL with the ids path if provided
        const finalUrl = idsPath
          ? `${BASE_URL}${url}/${idsPath}`
          : `${BASE_URL}${url}`;

        const response: AxiosResponse<T> = await axios.put(finalUrl, data, {
          headers: COMMON_HEADERS,
        });

        return response.data;
      } catch (error) {
        console.error("Error with PUT request:", error);
        throw error;
      }
    },
    []
  );

  const deleteData = useCallback(
    async <T = unknown,>(url: string, id: string | number = ""): Promise<T> => {
      try {
        const fullUrl = id ? `${BASE_URL}${url}/${id}` : `${BASE_URL}${url}`;
        const response: AxiosResponse<T> = await axios.delete(fullUrl, {
          headers: COMMON_HEADERS,
        });
        return response.data;
      } catch (error) {
        console.error("Error with DELETE request:", error);
        throw error;
      }
    },
    []
  );

  return { getData, postData, putData, deleteData };
};

export default useAxiosAPI;
