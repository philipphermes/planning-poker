import {Toast} from "remix-toast-notifications";
import {SESSION_KEY_TOASTS, sessionStorage} from "~/.server/session";

export const toast = new Toast(sessionStorage, SESSION_KEY_TOASTS)