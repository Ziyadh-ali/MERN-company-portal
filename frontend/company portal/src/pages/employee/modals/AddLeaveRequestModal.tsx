import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { getAllLeaveTypesService } from "../../../services/user/userService";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";

// LeaveType interface (for selecting leave types)
export interface LeaveType {
    _id?: string;
    name: string;
    description?: string;
    maxDaysAllowed: number;
    isPaid?: boolean;
    requiresApproval?: boolean;
}

// Interface for the leave request data
export interface LeaveRequest {
    employeeId?: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
}

// Props for the AddLeaveRequestModal
interface AddLeaveRequestModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (leaveRequest: LeaveRequest) => Promise<void>;
}

// Validation schema for the leave request form
const leaveRequestSchema = Yup.object({
    leaveTypeId: Yup.string().required("Leave type is required"),
    startDate: Yup.date()
        .required("Start date is required")
        .min(new Date(), "Start date cannot be in the past"),
    endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date cannot be before start date"),
    reason: Yup.string().required("Reason is required").min(5, "Reason must be at least 5 characters"),
});

const AddLeaveRequestModal = ({open, onClose, onAdd }: AddLeaveRequestModalProps) => {
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>();

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await getAllLeaveTypesService();
                setLeaveTypes(response.data);
            } catch (error) {
                console.log("error in fethcing leave types", error);
            }
        }
        fetchLeaveTypes();
    }, []);

    const formik = useFormik({
        initialValues: {
            leaveTypeId: "",
            startDate: "",
            endDate: "",
            reason: "",
        },
        validationSchema: leaveRequestSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Formik values:", values); // Log form values
        console.log("Formik errors:", formik.errors); // Log errors

            try {
                await onAdd(values);
                enqueueSnackbar("Leave Request added successfully", { variant: "success" });
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                resetForm();
                onClose();
            } catch (error) {
                console.error("Failed to submit leave request:", error);
                if (error instanceof AxiosError) {
                    enqueueSnackbar(error?.response?.data.message, { variant: "error" });
                }
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="rounded-xl max-w-md max-h-[80vh] overflow-y-auto
         scrollbar-hidden hover:scrollbar-thumb-black-400 scrollbar-thumb-rounded-full"
            >
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                        Apply for Leave
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="leaveType" className="text-sm font-medium text-gray-700">
                            Leave Type *
                        </Label>
                        <Select
                            name="leaveType"
                            value={formik.values.leaveTypeId}
                            onValueChange={(value) => formik.setFieldValue("leaveTypeId", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                                {leaveTypes && leaveTypes.map((leaveType) => (
                                    <SelectItem key={leaveType._id} value={leaveType._id as string}>
                                        {leaveType.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formik.touched.leaveTypeId && formik.errors.leaveTypeId ? (
                            <div className="text-red-500 text-sm">{formik.errors.leaveTypeId}</div>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                            Start Date *
                        </Label>
                        <Input
                            id="startDate"
                            name="startDate"
                            type="date"
                            className="w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.startDate}
                        />
                        {formik.touched.startDate && formik.errors.startDate ? (
                            <div className="text-red-500 text-sm">{formik.errors.startDate}</div>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                            End Date *
                        </Label>
                        <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                            className="w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.endDate}
                        />
                        {formik.touched.endDate && formik.errors.endDate ? (
                            <div className="text-red-500 text-sm">{formik.errors.endDate}</div>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                            Reason *
                        </Label>
                        <Input
                            id="reason"
                            name="reason"
                            type="text"
                            placeholder="Enter reason for leave"
                            className="w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.reason}
                        />
                        {formik.touched.reason && formik.errors.reason ? (
                            <div className="text-red-500 text-sm">{formik.errors.reason}</div>
                        ) : null}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Submitting..." : "Submit Leave Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLeaveRequestModal;