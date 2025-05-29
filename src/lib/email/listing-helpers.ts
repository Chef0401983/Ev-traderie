import { createServerClient } from '@/lib/supabase/server';

interface VehicleListing {
  id: string;
  make: string;
  model: string;
  year: number;
  seller_id: string;
  status: string;
}

interface UserProfile {
  email: string;
  full_name: string;
}

export async function sendListingApprovalEmail(
  vehicleId: string,
  approved: boolean,
  rejectionReason?: string
) {
  try {
    const supabase = createServerClient();

    // Get vehicle and seller information
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select(`
        *,
        profiles!vehicles_seller_id_fkey(email, full_name)
      `)
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      console.error('Error fetching vehicle:', vehicleError);
      return { success: false, error: 'Vehicle not found' };
    }

    const profile = vehicle.profiles as unknown as UserProfile;
    
    if (!profile?.email) {
      console.error('No email found for seller');
      return { success: false, error: 'Seller email not found' };
    }

    // Prepare email data
    const templateData = {
      name: profile.full_name || 'EV Trader User',
      vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      listingTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      listingId: vehicle.id,
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year.toString(),
      vehicleId: vehicle.id,
      newStatus: approved ? 'approved' : 'rejected',
      adminNote: rejectionReason || '',
      reason: rejectionReason || '',
      listingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${vehicle.id}`,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/individual/listings`
    };

    // Queue the appropriate email
    const template = approved ? 'listing-approved' : 'listing-rejected';
    const subject = approved 
      ? `Your ${vehicle.make} ${vehicle.model} listing is now live!`
      : `Action required: Your ${vehicle.make} ${vehicle.model} listing`;

    const { error: emailError } = await supabase
      .from('email_queue')
      .insert({
        to_addresses: [profile.email],
        subject,
        template,
        template_data: templateData,
        status: 'pending',
        attempts: 0,
        max_attempts: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (emailError) {
      console.error('Error queuing email:', emailError);
      return { success: false, error: 'Failed to queue email' };
    }

    return { success: true };

  } catch (error) {
    console.error('Error in sendListingApprovalEmail:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function sendListingStatusUpdate(
  vehicleId: string,
  newStatus: string,
  adminNote?: string
) {
  try {
    const supabase = createServerClient();

    // Get vehicle and seller information
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select(`
        *,
        profiles!vehicles_seller_id_fkey(email, full_name)
      `)
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return { success: false, error: 'Vehicle not found' };
    }

    const profile = vehicle.profiles as unknown as UserProfile;
    
    if (!profile?.email) {
      return { success: false, error: 'Seller email not found' };
    }

    // Only send emails for significant status changes
    const emailStatuses = ['approved', 'rejected', 'suspended', 'expired'];
    if (!emailStatuses.includes(newStatus)) {
      return { success: true }; // No email needed
    }

    let template = 'listing-status-update';
    let subject = `Update on your ${vehicle.make} ${vehicle.model} listing`;

    // Use specific templates for common statuses
    if (newStatus === 'approved') {
      template = 'listing-approved';
      subject = `Your ${vehicle.make} ${vehicle.model} listing is now live!`;
    } else if (newStatus === 'rejected') {
      template = 'listing-rejected';
      subject = `Action required: Your ${vehicle.make} ${vehicle.model} listing`;
    }

    const templateData = {
      name: profile.full_name || 'EV Trader User',
      vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      listingTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      listingId: vehicle.id,
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year.toString(),
      vehicleId: vehicle.id,
      newStatus,
      adminNote: adminNote || '',
      reason: adminNote || '',
      listingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${vehicle.id}`,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/individual/listings`
    };

    const { error: emailError } = await supabase
      .from('email_queue')
      .insert({
        to_addresses: [profile.email],
        subject,
        template,
        template_data: templateData,
        status: 'pending',
        attempts: 0,
        max_attempts: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (emailError) {
      console.error('Error queuing status update email:', emailError);
      return { success: false, error: 'Failed to queue email' };
    }

    return { success: true };

  } catch (error) {
    console.error('Error in sendListingStatusUpdate:', error);
    return { success: false, error: 'Internal server error' };
  }
}
