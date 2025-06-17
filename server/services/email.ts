import nodemailer from "nodemailer";
import type { Lead, Booking } from "@shared/schema";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "noreply@brasilcultural.com",
        pass: process.env.SMTP_PASS || "demo_password",
      },
    });
  }

  async sendLeadConfirmation(email: string, lead: Lead): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER || "noreply@brasilcultural.com",
      to: email,
      subject: "Your Brazil Travel Interest - Brasil Cultural Agency",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #228B22, #1E88E5); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Brasil Cultural Agency</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Your Brazilian Adventure Awaits!</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #228B22;">Thank you for your interest!</h2>
            <p>We've received your travel preferences and our AI consultant is preparing personalized recommendations for your Brazilian journey.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1E88E5; margin-top: 0;">Your Profile Details:</h3>
              <ul style="color: #666;">
                <li><strong>Profile Type:</strong> ${lead.interestLevel || "Cultural Explorer"}</li>
                <li><strong>Estimated Budget:</strong> $${lead.estimatedBudget || "TBD"}</li>
                <li><strong>Travel Dates:</strong> ${lead.travelDates || "Flexible"}</li>
              </ul>
            </div>
            
            <p>Our travel consultant will contact you within 24 hours with personalized package options and real-time pricing.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #228B22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Continue Planning Your Trip</a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Brasil Cultural Agency - AI-Powered Authentic Brazilian Experiences</p>
            <p>This email was sent because you expressed interest in traveling to Brazil.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Lead confirmation email sent to:", email);
    } catch (error) {
      console.error("Failed to send lead confirmation email:", error);
    }
  }

  async sendBookingConfirmation(email: string, booking: Booking): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER || "noreply@brasilcultural.com",
      to: email,
      subject: `Booking Confirmation #${booking.id} - Brasil Cultural Agency`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #228B22, #1E88E5); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Brasil Cultural Agency</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Booking Confirmation</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 10px 0;">✅ Your trip is confirmed!</h2>
              <p style="margin: 0;">Booking Reference: <strong>#${booking.id}</strong></p>
            </div>
            
            <h3 style="color: #228B22;">Trip Details:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <ul style="color: #666; margin: 0; padding: 0; list-style: none;">
                <li style="margin-bottom: 10px;"><strong>Total Price:</strong> $${booking.totalPrice}</li>
                <li style="margin-bottom: 10px;"><strong>Travel Dates:</strong> ${booking.travelDateStart ? new Date(booking.travelDateStart).toLocaleDateString() : "TBD"} - ${booking.travelDateEnd ? new Date(booking.travelDateEnd).toLocaleDateString() : "TBD"}</li>
                <li style="margin-bottom: 10px;"><strong>Passengers:</strong> ${booking.passengersCount || 1}</li>
                <li style="margin-bottom: 10px;"><strong>Flight Reference:</strong> ${booking.flightBookingRef || "Processing"}</li>
                <li style="margin-bottom: 10px;"><strong>Hotel Reference:</strong> ${booking.hotelBookingRef || "Processing"}</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0;">📋 Next Steps:</h4>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Check your email for detailed flight and hotel confirmations</li>
                <li>Ensure your passport is valid for at least 6 months</li>
                <li>Our travel coordinator will contact you 72 hours before departure</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #228B22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Full Itinerary</a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Brasil Cultural Agency - AI-Powered Authentic Brazilian Experiences</p>
            <p>24/7 Support: support@brasilcultural.com | +1 (555) 123-BRAZIL</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Booking confirmation email sent to:", email);
    } catch (error) {
      console.error("Failed to send booking confirmation email:", error);
    }
  }
}

export const emailService = new EmailService();
