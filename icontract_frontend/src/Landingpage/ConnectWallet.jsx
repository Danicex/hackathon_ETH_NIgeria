

import { useNavigate } from 'react-router-dom';
import { useMyContext } from '@/Context/AppContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';



const ConnectWallet = () => {
  const { walletAdd, setWalletAdd, api_endpoint } = useMyContext(); // Call it as a function
  const [open, setOpen] = useState(null)
  const [name, setName] = useState('')
  const { disconnect } = useDisconnect ();
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  const checkUser = ()=>{
    axios.get(`${api_endpoint}/user_check`, {
  params: { wallet_address: address}
})
.then((res) => {
 setOpen(false);
})
.catch((err) => {
  console.error("Error fetching projects:", err);
  // Optional: set error state for UI feedback
  setOpen(true)
});
  }
  useEffect(() => {
    setWalletAdd(address);
    checkUser()    
  }, [isConnected])



  const handleCreateUser = () => {
    if (isConnected) {
      // Store user wallet address in local storage
      localStorage.setItem('wallet', address);
      // Update context state
   
      axios.post(`${api_endpoint}/user`, {
    name: name,
    wallet_address: walletAdd
}, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(res => {
        const user = res.data
        localStorage.setItem('user_data', JSON.stringify(user))
        console.log(user)
        navigate('/IDE')
      }).catch((err) => {
        navigate('/')
      })
    } else {
      navigate('/')

    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isConnected ? (
        <div>

          {open && (
            <Card className=' top-20 bg-gray-800' >
              <CardHeader className='flex'>
                <span className='text-red-700'><CircleAlert /> </span>
                <p className='text-orange-400'>please enter a prefered username</p>
              </CardHeader>
              <CardContent>
                <Input value={name} placeholder="username..." onChange={(e) => { setName(e.target.value) }} />
                <button onClick={handleCreateUser} className='py-2 px-4 my-2 rounded-md'>Save</button>
              </CardContent>
              
            </Card>
          )}
          <p className="text-green-500">Connected: {address}</p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Disconnect
          </button>
        </div>
      ) : (
      
      <ConnectKitButton />
   
      )}
    </div>
  );
};

export default ConnectWallet;
