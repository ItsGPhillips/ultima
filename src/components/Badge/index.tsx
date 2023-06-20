import { FaCircle, FaLock, FaUserAlt } from "react-icons/fa";
import { MdShield } from "react-icons/md";
import { RiVipDiamondFill } from "react-icons/ri";
import colors from "tailwindcss/colors";
import { cn } from "~/utils/cn";

const elements: Record<
   string,
   {
      label: string;
      styles: string;
      icon: React.ReactElement<SVGSVGElement>;
   }
> = {
   pro: {
      label: "Pro",
      styles: "border-purple-500 bg-purple-500/30",
      icon: (
         <RiVipDiamondFill
            color={colors.purple["200"]}
            className="aspect-square h-6 !stroke-purple-500"
         />
      ),
   },
   user: {
      label: "User",
      styles: "border-blue-500 bg-blue-500/30",
      icon: (
         <FaUserAlt
            color={colors.blue["200"]}
            className="aspect-blue h-6 !stroke-blue-500"
         />
      ),
   },
   verified: {
      label: "Verified",
      styles: "border-blue-500 bg-blue-500/30",
      icon: (
         <FaCircle
            color={colors.blue["200"]}
            className="aspect-square h-6 scale-95 !stroke-blue-500"
         />
      ),
   },
   admin: {
      label: "Admin",
      styles: "border-red-500 bg-red-500/30",
      icon: (
         <FaLock
            color={colors.red["200"]}
            className="aspect-square h-6 scale-75 !stroke-red-500"
         />
      ),
   },
   moderator: {
      label: "Moderator",
      styles: "border-green-500 bg-green-500/30",
      icon: (
         <MdShield
            color={colors.green["200"]}
            className="aspect-square h-6 scale-95 !stroke-green-500"
         />
      ),
   },
};

export const Badge = (props: {
   variant: string;
   ignoreLabel?: boolean;
   ignoreIcon?: boolean;
}) => {
   return (
      <div
         className={cn(
            "whitespace-nowrap text-xs text-white",
            "flex h-6 w-min items-center gap-2 rounded-md border-2",
            props.ignoreLabel ? "w-6 p-1" : "px-2",
            elements[props.variant]?.styles
         )}
      >
         {!props.ignoreIcon && elements[props.variant]?.icon}
         {!props.ignoreLabel && elements[props.variant]?.label}
      </div>
   );
};
