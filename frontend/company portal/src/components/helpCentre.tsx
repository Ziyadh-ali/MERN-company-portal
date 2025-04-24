import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminSideBar from "./adminComponents/AdminSideBar";
import AdminHeader from "./adminComponents/AdminHeader";
import { RootState } from "../store/store";
import { addFaqService, editFaqService, getFaqService } from "../services/user/userService";
import EmployeeSidebar from "./employeeComponents/employeeSidebar";
import { EmployeeHeader } from "./employeeComponents/employeeHeader";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ViewFaqModal } from "../pages/employee/modals/ViewFaqModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import AddEditFaqModal from "../pages/employee/modals/AddFaqModal";

// Interface for FAQ category
interface FAQCategory {
    _id?: string;
    topic: string;
    description: string;
    questions: {
        question: string;
        answer: string;
    }[];
}

interface HelpCenterPageProps {
    role: "admin" | "employee";
}

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ role }) => {
    const { employee } = useSelector((state: RootState) => state.employee);
    // const { admin } = useSelector((state: RootState) => state.admin);
    const [searchQuery, setSearchQuery] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [faqs, setFaqs] = useState<FAQCategory[]>([]);
    const [selectedFaq, setSelectedFaq] = useState<FAQCategory | null>(null);
    const [editabeFaq, setEditabeFaq] = useState<FAQCategory>();
    const [openFaqModal, setOpenFaqModal] = useState(false);

    useEffect(() => {
        const fetchFaqs = async () => {
            const response = await getFaqService();
            setFaqs(response.faqs);
        }
        fetchFaqs();
    }, []);

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        const trimmed = text.slice(0, maxLength);
        return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "...";
    };

    const handleAddFaq = async (data: {
        topic: string;
        description: string;
        questions: {
            question: string;
            answer: string;
        }[]
    }) => {
        await addFaqService(data);
    }

    
    const handleEditFaqModal = async (faqData: FAQCategory) => {
        setOpenEditModal(true);
        setEditabeFaq(faqData);
    };
    const handleEditFaq = async (id: string, faqData: FAQCategory) => {
        if (!id) return;
        await editFaqService(id, faqData);
    };

    const handleViewFaqs = async (faq: FAQCategory) => {
        setSelectedFaq(faq);
        setOpenFaqModal(true);
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {role === "admin" ?
                <AdminSideBar /> :
                <EmployeeSidebar />

            }

            <div className="flex-1 p-6">
                {role === "admin" ?
                    <AdminHeader /> :
                    <EmployeeHeader heading="FAQ Questions" />

                }


                <div className="flex justify-between items-center mb-6">
                    <Input
                        type="text"
                        placeholder="Search in FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-1/2"
                    />

                    {role === "employee" && employee?.role !== "developer" &&
                        <div>
                            <Button className="bg-blue-600 text-white" onClick={() => setOpenAddModal(true)}>Add Faq</Button>
                            {/* <Button className="bg-blue-600 text-white" onClick={() => setOpenAddModal(true)}>Add Faq</Button> */}
                        </div>
                    }
                    {role === "admin" &&
                        <div>
                            <Button className="bg-blue-600 text-white" onClick={() => setOpenAddModal(true)}>Add Faq</Button>
                        </div>
                    }
                    <AddEditFaqModal mode="add" onSubmit={handleAddFaq} onClose={() => setOpenAddModal(false)} open={openAddModal} />

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {faqs.map((category) => (
                        <Card key={category._id} className="shadow-sm relative">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-gray-800 pr-10">
                                    {category.topic}
                                </CardTitle>

                                {(role === "admin" || (role === "employee" && employee?.role !== "developer")) && (
                                    <div className="absolute top-4 right-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 shadow-lg">
                                                <DropdownMenuItem onClick={() => handleEditFaqModal(category)}>
                                                    ✏️ Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => console.log("Delete clicked")}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    🗑️ Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-2">{category.description}</p>
                                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                                    {category.questions[0] && category.questions[0].question.length < 80 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-700">
                                                {category.questions[0].question}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {truncateText(category.questions[0].answer, 40)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <Button onClick={() => handleViewFaqs(category)} className="w-full bg-blue-600 text-white">View FAQs</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <ViewFaqModal faq={selectedFaq} onClose={() => setOpenFaqModal(false)} open={openFaqModal} />
            <AddEditFaqModal mode="edit" initialData={editabeFaq} onSubmit={(data, id) => id ? handleEditFaq(id, data) : Promise.resolve()}
                onClose={() => setOpenEditModal(false)} open={openEditModal} />
        </div>
    );
};

export default HelpCenterPage;