import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import EmployeeSidebar from "../../../components/employeeComponents/employeeSidebar";
import { EmployeeHeader } from "../../../components/employeeComponents/employeeHeader";

// Interface for FAQ category
interface FAQCategory {
  id: string;
  title: string;
  description: string;
  question: string;
}

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories: FAQCategory[] = [
    { id: "1", title: "Leave", description: "FAQ's related leave are shown here", question: "How many Leaves are there ?..." },
    { id: "2", title: "Attendance", description: "FAQ's related leave are shown here", question: "How to check-in & check-out ?..." },
    { id: "3", title: "Payroll", description: "FAQ's related leave are shown here", question: "How payment will credit ?..." },
    { id: "4", title: "Project", description: "FAQ's related projects are shown here", question: "How to start doing a project ?..." },
    { id: "5", title: "Leave", description: "FAQ's related leave are shown here", question: "How many Leaves are there ?..." },
    { id: "6", title: "Project", description: "FAQ's related projects are shown here", question: "How to start doing a project ?..." },
    { id: "7", title: "Payroll", description: "FAQ's related leave are shown here", question: "How payment will credit ?..." },
    { id: "8", title: "Attendance", description: "FAQ's related leave are shown here", question: "How to check-in & check-out ?..." },
  ];

  // Filter FAQ categories based on search query
  const filteredCategories = faqCategories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <EmployeeHeader heading="FAQ Questions"/>
        {/* Header */}
        {/* <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">FAQ Questions</h1>
            <p className="text-sm text-gray-600">Frequently Asked Questions</p>
          </div>
        </div> */}

        {/* Search and Ask Other */}
        <div className="flex justify-between items-center mb-6">
          <Input
            type="text"
            placeholder="Search in FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2"
          />
          <Button className="bg-blue-600 text-white">Ask Other</Button>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-800">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <p className="text-gray-600 mb-4">{category.question}</p>
                <Button className="w-full bg-blue-600 text-white">View FAQs</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;