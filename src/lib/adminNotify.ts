type AdminToastType = "success" | "error" | "info";

export function notifyAdmin(message: string, type: AdminToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("admin-toast", {
      detail: { message, type },
    })
  );
}

export const notifySuccess = (message: string) => notifyAdmin(message, "success");
export const notifyError = (message: string) => notifyAdmin(message, "error");
export const notifyInfo = (message: string) => notifyAdmin(message, "info");

export const notifyUserSuccess = notifySuccess;
export const notifyUserError = notifyError;
export const notifyUserInfo = notifyInfo;
