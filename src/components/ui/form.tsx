"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceFn } from "@hooks/useDebounceFn";
import { cn } from "@lib/utils";
import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "@ui/label";
import type {
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";
import type * as z from "zod";

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

export type FormProps<T extends FieldValues> = Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> & {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  disabled?: boolean;
  submitOnBlur?: boolean;
};

const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  disabled,
  submitOnBlur = false,
  ...props
}: FormProps<T>) => {
  const debouncedBlurSubmit = useDebounceFn(() => {
    void form.handleSubmit(onSubmit)();
  }, 500);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onBlur={async () => {
          if (submitOnBlur) {
            debouncedBlurSubmit();
          }
        }}
        {...props}
        className={className}
      >
        <fieldset
          disabled={disabled ?? form.formState.isSubmitting}
          className={className}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = ({ className, ...props }: React.ComponentProps<"div">) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
};

const FormLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
};

const FormControl = ({ ...props }: React.ComponentProps<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};

const FormDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

const FormMessage = ({ className, ...props }: React.ComponentProps<"p">) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
};

type UseZodFormProps<
  Input extends FieldValues,
  Output extends FieldValues,
  Z extends z.ZodType<Output, Input>,
> = Exclude<UseFormProps<z.output<Z>>, "resolver"> & {
  schema: Z;
};

const useZodForm = <
  Input extends FieldValues,
  Output extends FieldValues,
  Z extends z.ZodType<Output, Input>,
>({
  schema,
  ...formProps
}: UseZodFormProps<Input, Output, Z>) =>
  useForm({
    ...formProps,
    resolver: zodResolver(schema) as never,
  });

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
  useZodForm,
};
