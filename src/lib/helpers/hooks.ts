import type { UseMessageStateOptions } from "@/src/@types/components";
import { useState } from "react";
import { CategoryFileManager } from "../classes/CategoryFileManager";
import type { UploadsFile } from "@/src/@types/database";

export function useMessageState<
  DefaultErrorValue = string,
  DefaultSuccessValue = string
>(
  options: UseMessageStateOptions<DefaultErrorValue, DefaultSuccessValue> = {}
) {
  const {
    testMode = false,
    defaultErrorValue = "",
    defaultSuccessValue = "",
    testErrorValue = defaultErrorValue,
    testSuccessValue = defaultSuccessValue,
  } = options;

  const [errorMessage, _setErrorMessage] = useState(
    (testMode
      ? testErrorValue
      : defaultErrorValue) as NoInfer<DefaultErrorValue>
  );
  const [successMessage, _setSuccessMessage] = useState(
    (testMode
      ? testSuccessValue
      : defaultSuccessValue) as NoInfer<DefaultSuccessValue>
  );

  const setErrorMessage = (message: NoInfer<DefaultErrorValue>) => {
    _setSuccessMessage(defaultSuccessValue as NoInfer<DefaultSuccessValue>);
    _setErrorMessage(message);
  };

  const setSuccessMessage = (message: NoInfer<DefaultSuccessValue>) => {
    _setErrorMessage(defaultErrorValue as NoInfer<DefaultErrorValue>);
    _setSuccessMessage(message);
  };

  const clearMessages = () => {
    _setErrorMessage(defaultErrorValue as NoInfer<DefaultErrorValue>);
    _setSuccessMessage(defaultSuccessValue as NoInfer<DefaultSuccessValue>);
  };

  return {
    clearMessages,
    setErrorMessage,
    setSuccessMessage,
    errorMessage,
    successMessage,
  };
}

export function useFileManager(
  category: string,
  startFiles: UploadsFile[] = []
) {
  const [files, setFiles] = useState<UploadsFile[]>(startFiles);
  const [categoryManager] = useState(
    new CategoryFileManager({
      category,
      updateState: setFiles,
      files,
    })
  );

  return {
    categoryManager,
    files,
  };
}
