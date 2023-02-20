declare module "*.jpg" {
  const path: string;
  export default path;
}

declare module "*.png" {
  const path: string;
  export default path;
}

declare interface Movie {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  mpaa_rating: string;
  description: string;
}

declare interface InputField {
  title: string;
  name: string;
  type: string;
  className: string;
  placeHolder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  autoComplete: string;
  value: string;
  errorDiv: string;
  errorMessage: string;
}

declare interface Alert {
  className: string;
  message: string;
}
