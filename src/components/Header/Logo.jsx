export default function Logo({ size = "h-8 w-8" }) {
  return (
    <div className={size + " text-primary"}>
      <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path
          clipRule="evenodd"
          d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
