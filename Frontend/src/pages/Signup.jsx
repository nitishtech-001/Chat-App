import React, { useState } from 'react'

export default function Signup() {
  const [showPassword,setShowPassword] = useState(false);
  const [formData,setFormData] = useState(
    {
      username : "",
      email : "",
      password : "",
    }
  );
  return (
    <div>Signup</div>
  )
}
