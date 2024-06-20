

export class Utils {
    static trimErrorString = (error: string) => {
        const index = error.lastIndexOf(':');
        return error.slice(index);
    }

}