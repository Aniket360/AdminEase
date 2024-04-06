import { GraphQLFormattedError } from "graphql";

type Error = {
    message: string;
    statusCode: string;
}

const customFectch = async (url: string, option: RequestInit) => {
    const accessToken = localStorage.getItem('access_token');

    const headers = option.headers as Record<string, string>;

    return await fetch(url, {
        ...option,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `bearer.${accessToken}`,

            "Content-Type": "application/json",

            "Appollo-Require-Preflight": "true",




        }
    })
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
    if (!body) {
        return {
            message: 'Unknown error',
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }

    if ("errors" in body) {
        const errors = body?.errors;

        const messages = errors?.map((error) => error?.message)?.join("");

        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500
        }
    }

    return null
}


export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFectch(url, options);

    const responseClone = response.clone();
    const body = await responseClone.json();

    const error = getGraphQLErrors(body);

    if (error) {
        throw error;
    }
    return response;

}