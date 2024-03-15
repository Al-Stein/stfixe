export default function ModernWithBadge(props) {
  return (
    <div
      className="p-2 text-red-700 bg-red-100 items-center leading-none lg:rounded-full flex lg:inline-flex"
      role="alert"
    >
      <span className="flex rounded-full text-white bg-red-900 uppercase px-2 py-1 text-xs font-bold mr-3">
        {props.badge}
      </span>
      <span className="font-semibold mr-2 text-left flex-auto">
        {props.children}
      </span>
    </div>
  );
}
