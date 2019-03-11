export class ApiException<T> {
    data?: T;
    error: string;
    message: string;
    success: boolean;
}
