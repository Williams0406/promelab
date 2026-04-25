"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const ACTION_ERROR_MESSAGES = {
  add: "No pudimos agregar este producto al carrito.",
  update: "No pudimos guardar la cantidad.",
  remove: "No pudimos quitar este producto del carrito.",
};

export default function AddToCartButton({
  product,
  size = "default",
  layout = "default",
}) {
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [draftQuantity, setDraftQuantity] = useState("1");
  const [pendingAction, setPendingAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const itemInCart = items.find(
    (item) => String(item.product.id) === String(product.id)
  );

  const cartQuantity = Math.max(0, Number(itemInCart?.quantity ?? 0));
  const isCardLayout = layout === "card";
  const isCompact = isCardLayout || size === "sm";
  const isLarge = size === "lg";
  const isAccessChecking = product.is_restricted && authLoading;
  const needsLogin =
    product.is_restricted && !authLoading && !isAuthenticated;
  const isBusy = pendingAction !== null;

  useEffect(() => {
    if (itemInCart) {
      setDraftQuantity(String(cartQuantity));
      return;
    }

    setDraftQuantity((current) => {
      const nextValue = Number(current);

      if (!Number.isFinite(nextValue) || nextValue < 1) {
        return "1";
      }

      return String(Math.round(nextValue));
    });
  }, [cartQuantity, itemInCart]);

  const normalizeQuantity = (value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 1;
    }

    return Math.max(1, Math.round(numericValue));
  };

  const draftHasPendingUpdate =
    itemInCart &&
    draftQuantity !== "" &&
    normalizeQuantity(draftQuantity) !== cartQuantity;

  const currentQuantity = itemInCart
    ? cartQuantity
    : normalizeQuantity(draftQuantity || 1);

  const clearError = () => setErrorMessage("");

  const runCartAction = async (actionName, callback) => {
    clearError();
    setPendingAction(actionName);

    try {
      await callback();
    } catch (error) {
      console.error(error);
      setErrorMessage(ACTION_ERROR_MESSAGES[actionName]);
    } finally {
      setPendingAction(null);
    }
  };

  const commitQuantity = async (nextQuantity) => {
    const normalizedQuantity = normalizeQuantity(nextQuantity);

    setDraftQuantity(String(normalizedQuantity));

    if (!itemInCart || normalizedQuantity === cartQuantity) {
      return;
    }

    await runCartAction("update", () =>
      updateQuantity(itemInCart.id, normalizedQuantity)
    );
  };

  const handleStepChange = async (direction) => {
    clearError();

    if (needsLogin || isAccessChecking || isBusy) {
      return;
    }

    const nextQuantity = Math.max(1, currentQuantity + direction);

    if (nextQuantity === currentQuantity) {
      return;
    }

    if (itemInCart) {
      await commitQuantity(nextQuantity);
      return;
    }

    setDraftQuantity(String(nextQuantity));
  };

  const handleInputChange = (event) => {
    clearError();

    if (event.target.value === "") {
      setDraftQuantity("");
      return;
    }

    setDraftQuantity(event.target.value.replace(/[^\d]/g, ""));
  };

  const handleInputBlur = async () => {
    if (needsLogin || isAccessChecking || isBusy) {
      return;
    }

    if (draftQuantity === "") {
      setDraftQuantity(itemInCart ? String(cartQuantity) : "1");
      return;
    }

    await commitQuantity(draftQuantity);
  };

  const handleInputKeyDown = async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (itemInCart) {
      await handleInputBlur();
      return;
    }

    await handleAdd();
  };

  async function handleAdd() {
    if (needsLogin || isAccessChecking || isBusy) {
      return;
    }

    const quantityToAdd = normalizeQuantity(draftQuantity || 1);
    setDraftQuantity(String(quantityToAdd));

    await runCartAction("add", () => addItem(product, quantityToAdd));
  }

  const handleRemove = async () => {
    if (!itemInCart || isBusy) {
      return;
    }

    await runCartAction("remove", async () => {
      await removeItem(itemInCart.id);
      setDraftQuantity("1");
    });
  };

  const statusMessage = (() => {
    if (errorMessage) {
      return errorMessage;
    }

    if (pendingAction === "add") {
      return "Agregando...";
    }

    if (pendingAction === "update") {
      return "Guardando cambios...";
    }

    if (pendingAction === "remove") {
      return "Quitando...";
    }

    if (!isCardLayout && draftHasPendingUpdate) {
      return "Pulsa Enter para guardar.";
    }

    return null;
  })();

  const surfaceClassName = cn(
    "w-full border border-[#D7E8EF]",
    isCardLayout
      ? "rounded-[18px] bg-[#F8FBFD] p-2.5"
      : "rounded-2xl bg-[linear-gradient(180deg,#FFFFFF_0%,#F7FBFD_100%)] shadow-[0_16px_40px_-32px_rgba(0,35,102,0.7)]",
    isCardLayout && itemInCart && "border-[#BFE1EC] bg-[#F3FBFE]",
    !isCardLayout && (isCompact ? "space-y-3 p-3" : "space-y-4 p-4"),
    !isCardLayout && isLarge && "p-5"
  );

  const quantityControlClassName = cn(
    "grid items-center",
    isCardLayout
      ? "min-w-0 flex-1 grid-cols-[40px_minmax(44px,1fr)_40px] overflow-hidden rounded-xl border border-[#D4E2EA] bg-white shadow-sm"
      : "grid-cols-[auto_minmax(0,1fr)_auto] gap-2"
  );

  const stepButtonClassName = cn(
    "flex items-center justify-center text-[#002366] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45",
    isCardLayout
      ? "h-10 w-10 hover:bg-[#F2FBFE]"
      : "border border-[#D4E2EA] bg-white hover:border-[#00A8CC] hover:text-[#00A8CC]",
    !isCardLayout && (isCompact ? "h-10 w-10 rounded-xl" : "h-11 w-11 rounded-xl")
  );

  const inputClassName = cn(
    "bg-white text-center font-semibold text-[#002366]",
    isCardLayout
      ? "h-10 rounded-none border-x border-y-0 border-[#E1EEF3] bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
      : cn(
          "border-[#D4E2EA] focus-visible:ring-[#00A8CC]",
          isCompact ? "h-10 rounded-xl text-sm" : "h-11 rounded-xl text-base"
        )
  );

  const primaryButtonClassName = cn(
    "rounded-xl bg-[#002366] text-white shadow-sm hover:bg-[#003380]",
    isCardLayout ? "h-10 min-w-[108px] px-3 text-sm" : "",
    !isCardLayout && (isCompact ? "h-10 w-full text-sm" : "h-11 w-full text-sm"),
    !isCardLayout && isLarge && "h-12"
  );

  const removeButtonClassName = cn(
    "inline-flex shrink-0 items-center justify-center rounded-xl border border-[#F5C9C3] bg-white text-[#E5533D] transition-colors duration-200 hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-45",
    isCardLayout ? "h-10 w-10" : "h-11 px-3"
  );

  const quantityControl = (
    <div className={quantityControlClassName}>
      <button
        type="button"
        onClick={() => handleStepChange(-1)}
        disabled={isBusy || currentQuantity <= 1}
        className={stepButtonClassName}
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-4 w-4" />
      </button>

      <Input
        type="number"
        min={1}
        inputMode="numeric"
        value={draftQuantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        disabled={isBusy}
        className={inputClassName}
        aria-label={
          itemInCart
            ? "Cantidad actual del producto en el carrito"
            : "Cantidad a agregar al carrito"
        }
      />

      <button
        type="button"
        onClick={() => handleStepChange(1)}
        disabled={isBusy}
        className={stepButtonClassName}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );

  if (isAccessChecking) {
    if (isCardLayout) {
      return (
        <div className={surfaceClassName}>
          <div className="flex h-10 items-center justify-center rounded-xl border border-[#D4E2EA] bg-white text-[#002366]">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      );
    }

    return (
      <div className={surfaceClassName}>
        <div className="flex items-center gap-3 text-[#002366]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (needsLogin) {
    if (isCardLayout) {
      return (
        <div className={surfaceClassName}>
          <Button
            type="button"
            onClick={() => router.push("/login")}
            className="h-10 w-full rounded-xl border border-[#00A8CC] bg-white text-sm text-[#002366] hover:bg-[#F2FBFE]"
          >
            Iniciar sesion
          </Button>
        </div>
      );
    }

    return (
      <div className={surfaceClassName}>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#002366]">
            Compra con acceso validado
          </p>
          <Button
            type="button"
            onClick={() => router.push("/login")}
            className="h-11 w-full rounded-xl border border-[#00A8CC] bg-white text-sm text-[#002366] hover:bg-[#F2FBFE]"
          >
            Iniciar sesion
          </Button>
        </div>
      </div>
    );
  }

  if (isCardLayout) {
    return (
      <div className={surfaceClassName}>
        {errorMessage && (
          <p
            className="mb-2 text-[11px] font-medium text-[#E5533D]"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        )}

        <div className="flex items-center gap-2">
          {quantityControl}

          {itemInCart ? (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isBusy}
              className={removeButtonClassName}
              aria-label="Eliminar producto del carrito"
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          ) : (
            <Button
              type="button"
              onClick={handleAdd}
              disabled={isBusy}
              className={primaryButtonClassName}
            >
              {pendingAction === "add" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              {currentQuantity > 1 ? `Agregar ${currentQuantity}` : "Agregar"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={surfaceClassName}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#002366]">Cantidad</p>
        {itemInCart && (
          <span className="shrink-0 rounded-full bg-[#EAF7FB] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0B6C84]">
            {cartQuantity} en carrito
          </span>
        )}
      </div>

      {statusMessage && (
        <p
          className={cn(
            "text-xs leading-relaxed",
            errorMessage ? "text-[#E5533D]" : "text-[#687280]"
          )}
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}

      {quantityControl}

      {itemInCart ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRemove}
            disabled={isBusy}
            className={removeButtonClassName}
            aria-label="Eliminar producto del carrito"
          >
            {isBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>Quitar</span>
          </button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={handleAdd}
          disabled={isBusy}
          className={primaryButtonClassName}
        >
          {pendingAction === "add" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          Agregar {currentQuantity > 1 ? `${currentQuantity} unidades` : "al carrito"}
        </Button>
      )}
    </div>
  );
}
