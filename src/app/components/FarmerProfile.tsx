'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getTokensFromLocalStorage, refreshAccessTokenIfNeeded } from '@utils/tokenUtils';

interface FarmerProfileType {
  business_name?: string;
  email?: string;
  phone?: string;
  image?: string;
  address?: string;
  created_at?: string;
  current_period_opened?: boolean;
  financial_year_start?: string;
  financial_year_end?: string;
}

export default function FarmerProfile() {
  const [profile, setProfile] = useState<FarmerProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { accessToken, refreshToken } = getTokensFromLocalStorage();
        if (!accessToken || !refreshToken) return;

        const validToken = await refreshAccessTokenIfNeeded(accessToken, refreshToken);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/business/profile/`, {
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch farmer profile');
        const data: FarmerProfileType = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Could not load profile.');
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="profileError">{error}</p>;
  if (!profile) return <p className="profileLoading">Loading profile...</p>;

    console.log(profile)

  return (
    <div className="farmerProfileWrapper">
      <h2 className="profileHeading">Business Profile</h2>
      {profile.image ? (
        <Image
          className="profilePic"
          src={`${process.env.NEXT_PUBLIC_DJANGO_API_URL}${profile.image}`}
          alt="profile"
          width={150}
          height={150}
        />
      ) : (
        <p className="noImage"><i>No profile picture uploaded</i></p>
      )}
      <p className='profiles'><b>Name:</b> {profile.business_name || 'N/A'}</p>
      <p className='profiles'><b>Email:</b> {profile.email || 'N/A'}</p>
      <p className='profiles'><b>Phone:</b> {profile.phone || 'N/A'}</p>
      <p className='profiles'><b>Address:</b> {profile.address || 'N/A'}</p>
      <p className='profiles'><b>Created At:</b> {profile.created_at || 'N/A'}</p>
      <p className='profiles'><b>Current period open:</b> {profile.current_period_opened || 'N/A'}</p>
      <p className='profiles'><b>Financial year start:</b> {profile.financial_year_start || 'N/A'}</p>
      <p className='profiles'><b>Financial year end:</b> {profile.financial_year_end || 'N/A'}</p>
    </div>
  );
}
