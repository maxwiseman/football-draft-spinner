import "@/styles/spinner.css";

export default function Spinner() {
  const sliceCount = 32;
  const sliceAngle = 360 / sliceCount;

  return (
    <ul className="circle">
      {Array.from(Array(sliceCount).keys()).map((i) => {
        return (
          <SpinnerItem key={i} itemNumber={i}>
            {i + 1}
          </SpinnerItem>
        );
      })}
    </ul>
  );
  function SpinnerItem({
    children,
    itemNumber,
  }: {
    children?: React.ReactNode;
    itemNumber: number;
  }) {
    return (
      <li
        style={{
          transform: `rotate(${sliceAngle * itemNumber}deg) skewY(${-(
            90 - sliceAngle
          )}deg)`.toString(),
          WebkitTransform: `rotate(${sliceAngle * itemNumber}deg) skewY(${-(
            90 - sliceAngle
          )}deg)`.toString(),
          msTransform: `rotate(${sliceAngle * itemNumber}deg) skewY(${-(
            90 - sliceAngle
          )}deg)`.toString(),
        }}
      >
        <div
          className={"text"}
          style={{
            transform: `skewY(${90 - sliceAngle}deg) rotate(${
              sliceAngle / 2
            }deg)`.toString(),
            // transform: "skewY(75deg)",
            WebkitTransform: `skewY(${90 - sliceAngle}deg) rotate(${
              sliceAngle / 2
            }deg)`.toString(),
            msTransform: `skewY(${90 - sliceAngle}deg) rotate(${
              sliceAngle / 2
            }deg)`.toString(),
          }}
        >
          {children}
        </div>
      </li>
    );
  }
}
