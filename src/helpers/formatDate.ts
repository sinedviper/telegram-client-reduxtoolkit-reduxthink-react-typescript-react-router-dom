export const formateDate = (data: Date): string => {
  const todayDate = new Date();

  if (todayDate.getFullYear() === data.getFullYear()) {
    if (todayDate.getMonth() === data.getMonth()) {
      if (todayDate.getDate() === data.getDate()) {
        return new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(data);
      } else {
        if (todayDate.getDate() - 7 <= 0) {
          return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
          }).format(data);
        } else {
          if (todayDate.getDate() - 7 >= data.getDate()) {
            return (
              new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                data
              ) +
              " " +
              data.getDate()
            );
          } else {
            return new Intl.DateTimeFormat("en-US", {
              weekday: "short",
            }).format(data);
          }
        }
      }
    } else {
      let day = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate() - 7
      );

      if (day.getMonth() === data.getMonth()) {
        if (day.getDate() > data.getDate()) {
          return (
            new Intl.DateTimeFormat("en-US", { month: "short" }).format(data) +
            " " +
            data.getDate()
          );
        } else {
          return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
          }).format(data);
        }
      } else {
        return (
          new Intl.DateTimeFormat("en-US", { month: "short" }).format(data) +
          " " +
          data.getDate()
        );
      }
    }
  } else {
    return String(data.getFullYear());
  }
};
