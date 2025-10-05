"use client";

import { Fragment, createContext, use, useEffect, useRef } from "react";

import { Form, type FormProps } from "@components/ui/form";
import { useDebounceFn } from "@hooks/useDebounceFn";
import { useWarnIfUnsavedChanges } from "@hooks/useWarnIfUnsavedChanges";
import type { FieldValues } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";

const FormAutoSaveContext = createContext<{
  isDirty: boolean;
  isLoading: boolean;
  cancel: () => void;
  submit: () => void;
} | null>(null);

export const useFormAutoSave = () => {
  const ctx = use(FormAutoSaveContext);

  if (!ctx) {
    throw new Error("FormUnsavedBarContext is not provided");
  }

  return ctx;
};

export const FormAutoSave = <T extends FieldValues>({
  children,
  autoSaveMs,
  action,
  ...props
}: FormProps<T> & { autoSaveMs?: number; action?: string }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const submit = () => {
    buttonRef.current?.click();
  };
  const cancel = () => props.form.reset();

  const isDirty = props.form.formState.isDirty;

  useHotkeys("mod+s", submit, {
    enabled: isDirty,
    enableOnContentEditable: true,
    preventDefault: true,
    enableOnFormTags: true,
  });

  useWarnIfUnsavedChanges(
    isDirty,
    "You have unsaved changes. Are you sure you want to leave?",
  );

  return (
    <FormAutoSaveContext.Provider
      value={{
        isDirty,
        isLoading: props.form.formState.isSubmitting,
        cancel,
        submit,
      }}
    >
      <Fragment>
        <Form {...props} disabled={false}>
          {children}
          <button type="submit" className="hidden" ref={buttonRef} />
        </Form>
      </Fragment>
    </FormAutoSaveContext.Provider>
  );
};

export const FormAutoSaveWatch = <T extends FieldValues>(
  props: Pick<FormProps<T>, "form"> & { autoSaveMs?: number },
) => {
  const lastFormStateRef = useRef<string | null>(null);
  const watchedField = props.form.watch();
  const ctx = useFormAutoSave();

  const debounce = useDebounceFn(() => {
    const json = JSON.stringify(watchedField);
    if (json === lastFormStateRef.current) return;
    lastFormStateRef.current = json;

    ctx.submit();
  }, props.autoSaveMs);

  useEffect(() => {
    debounce();
  }, [debounce, watchedField]);

  return null;
};
