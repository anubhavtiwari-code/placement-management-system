import {useState} from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Register(){
    const [email,setEmail]= useState("");
     const [password,setPassword]= useState("");
      const [role,setRole]= useState("student");
       const navigate = useNavigate();

 const handleRegister = async (e)=>{
    e.preventDefault();
    try{
        await api.post("/auth/register",{email , password,role});
        alert("Registration Successful! Please Login.");
        navigate("/login");
    } catch (err){
        alert("Registration Failed. Please try again.");
    }
 };
 return (
    <div className="h-screen flex items-center justify -center">
        <form onSubmit={handleRegister} className="border p-6 rounded w-80">
           <h2 className="text-xl font-bold mb-4"> Register</h2>

          <select
  className="border p-2 w-full mb-3"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="student">Student</option>
  <option value="company">Company</option>
</select>


           <input
            className="border p-2 w-full mb-3"
            placeholder="Email"
            onChange={(e)=> setEmail(e.target.value)}
            />
            <input
            className="border p-2 w-full mb-3"
            placeholder="Password"
            type="password"
            onChange={(e)=> setPassword(e.target.value)}
            />
                
           <button className="bg-green-600 text-white w-full p-2 rounded">
            Register
           </button>
           
        </form>
    </div>
 );
}

export default Register;