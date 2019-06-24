import { CookieService } from 'ngx-cookie-service';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Injectable()
export class CookieServerService extends CookieService {
    private cookies: Map<string, string>;

    constructor(
        @Inject('cookies') c: any,
        @Inject(DOCUMENT) private _document: any,
        @Inject(PLATFORM_ID) private _platformId: any
    ) {
        super(_document, _platformId);
        const cookies = JSON.parse(c);
        this.cookies = new Map<string, string>();

        for (const cookie of cookies) {
            this.cookies.set(cookie.key, cookie.value);
        }
    }

    check(name: string): boolean {
        return this.cookies && this.cookies.has(name);
    }

    get(name: string): string {
        if (this.cookies) {
            return this.cookies.get(name);
        }
        return '';
    }

    getAll(): {} {
        const cookies: {} = {};
        if (this.cookies) {
            this.cookies.forEach((value, key) => {
                cookies[key] = value;
            });
        }
        return cookies;
    }

    set(name: string, value: string, expires?: number | Date, path?: string, domain?: string, secure?: boolean): void {
        // throw new Error("Method not implemented.");
    }

    delete(name: string, path?: string, domain?: string): void {
        // throw new Error("Method not implemented.");
    }

    deleteAll(path?: string, domain?: string): void {
        // throw new Error("Method not implemented.");
    }
}
