import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { employeeLogout } from "../../store/slices/employeeSlice";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { logoutService } from "../../services/user/userService";
import { RootState } from "../../store/store";

interface Props {
    heading : string,
}

export const UserHeader : React.FC<Props> = ({heading}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { employee } = useSelector((state: RootState) => state.employee);

    const handleLogout = async () => {
        try {
            const response = await logoutService();
            dispatch(employeeLogout());
            enqueueSnackbar(response.message, { variant: "success" });
            navigate("/login");
        } catch (error) {
            console.log("Error in logout", error);
        }
    }
    return (<div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-semibold text-gray-800">
                {heading}
            </h1>
            <p className="text-sm text-gray-600">Here’s what’s happening today</p>
        </div>
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                            <AvatarImage
                                src={employee && employee?.profilePic?.length > 0 ? employee?.profilePic : "https://via.placeholder.com/40"}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <AvatarFallback className="w-12 h-12 rounded-full flex items-center justify-center text-lg bg-gray-200">
                                HV
                            </AvatarFallback>
                        </Avatar>

                        <span className="text-gray-800">{employee?.fullName}</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate(`/profile`)}>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
    )
}