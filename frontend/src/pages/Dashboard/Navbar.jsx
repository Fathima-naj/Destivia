// import React ,{useState} from 'react'
// import { Link } from 'react-router-dom'
// import { Plane } from 'lucide-react';
// import { Hotel } from 'lucide-react';
// import { FerrisWheel ,Menu} from 'lucide-react';

// const navItems=[
//     {name:'Hotels',icon:<Hotel/>,path:'/hotels'},
//     {name:'Flights',icon:<Plane/>,path:'/flights'},
//     {name:'Attractions',icon:<FerrisWheel/>,path:'/place'}
// ]
// function Navbar() {
//     const [isExpanded,setIsExpanded]=useState('')
//   return (
//     <div>
//       <div className={`h-screen bg-white border-r border-r-gray-300 transition-all duration-300 ${isExpanded ? "w-48" : "w-16"}`}>

     
//        <div className="flex items-center justify-center h-16">
//         <button
//           onClick={() => setIsExpanded((prev) => !prev)}
//           className="text-gray-600 hover:text-blue-600"
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//       </div> 

      
//       <ul
//        className="space-y-4 mt-auto"
//       >
//         {navItems.map((item) => (
//           <li key={item.name}
          
//           >
//             <Link
//               to={item.path}
//               className="flex cursor-pointer items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 transition rounded-md"
//             >
//               <span className="w-5 h-5" 
//               // onMouseEnter={() => setIsExpanded((prev) => !prev)}
//               // onMouseLeave={() => setIsExpanded((prev) => !prev)}
              
//               >{item.icon}
              
//               </span>
//               {isExpanded && <span className="text-sm">{item.name}</span>}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>

//     </div>
      
    
//   )
// }

// export default Navbar
