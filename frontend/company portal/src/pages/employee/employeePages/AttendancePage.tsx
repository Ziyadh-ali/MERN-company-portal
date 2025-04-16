import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmployeeSidebar from "../../../components/employeeComponents/employeeSidebar";
import { EmployeeHeader } from "../../../components/employeeComponents/employeeHeader";
import { fetchAttendanceDataService } from "../../../services/user/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

// Interface for attendance data
interface AttendanceDay {
  date: string;
  status: "Present" | "Absent" | "Late" | "Leave" | "Pending";
}

const AttendancePage = () => {
  const { employee } = useSelector((state: RootState) => state.employee)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceDay[]>([]);

  // Fetch attendance data when the month or year changes
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAttendanceDataService(
        employee?._id ? employee._id : "",
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      console.log("attendnce", data.attendancesOfMonth)
      setAttendanceData(data.attendancesOfMonth);
    };
    fetchData();
  }, [currentDate, employee?._id]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const attendance = attendanceData.find((d) => {
        const attendanceDate = new Date(d.date);
        return (
          attendanceDate.getDate() === day &&
          attendanceDate.getMonth() === month &&
          attendanceDate.getFullYear() === year
        );
      });
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      const todayHighlight = isToday ? "ring-2 ring-blue-300 shadow-md" : "";

      let bgColor = "bg-white"; // default

      if (isWeekend) {
        bgColor = "bg-yellow-100"; // weekend
      }

      if (attendance) {
        if (attendance.status === "Present") bgColor = "bg-green-300";
        else if (attendance.status === "Absent") bgColor = "bg-red-300";
        else if (attendance.status === "Pending") bgColor = "bg-gray-300";
      }

      days.push(
        <div
          key={day}
          className={`p-2 text-center ${bgColor} border border-gray-200 rounded-md ${todayHighlight}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* <AdminHeader  /> */}
        <EmployeeHeader heading="Attendance Details" />
        {/* Header */}

        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeMonth("prev")}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeMonth("next")}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
            {/* Legend */}
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-200 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Weekend</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Days of the Week */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center font-semibold text-gray-600"
                >
                  {day}
                </div>
              ))}
              {/* Calendar Days */}
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;