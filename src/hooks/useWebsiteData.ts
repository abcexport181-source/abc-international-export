import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { WebsiteData } from '@/types/database';

export const useWebsiteData = () => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const defaultData = {
        sections: [
            { id: '1', name: 'hero', title: 'Hero', is_visible: true, order_index: 0 },
            { id: '2', name: 'services', title: 'What We Do', is_visible: true, order_index: 1 },
            { id: '3', name: 'logistics', title: 'Logistics', is_visible: true, order_index: 2 },
            { id: '4', name: 'industries', title: 'Industries We Serve', is_visible: true, order_index: 3 },
            { id: '5', name: 'quality', title: 'Quality Assurance', is_visible: true, order_index: 4 },
            { id: '6', name: 'process', title: 'Our Process', is_visible: true, order_index: 5 },
        ],
        pages: {
            home: {
                hero: { title: 'Your Trusted Merchant Exporter from India', subtitle: 'Global sourcing expertise backed by comprehensive logistics support.', ctaPrimary: 'Request Sourcing', ctaSecondary: 'Learn More', bgImage: '/images/hero_bg.png' }
            },
            about: {
                hero: { title: 'About Us', subtitle: 'Expert Sourcing Partner & Merchant Exporter from India. Backed by Linear Global.', ctaPrimary: 'Our Services', ctaSecondary: 'Contact Us', bgImage: '/images/hero_bg.png' },
                sourcingPartner: { title: 'As Your Sourcing Partner', description: 'Vetting manufacturers, price negotiation, and sample management.' },
                merchantExporter: { title: 'As Merchant Exporter', description: 'Handling export documentation, customs clearance, and critical certifications.' }
            },
            sourcing: {
                hero: { title: 'Precision Sourcing', subtitle: 'Our 6-step sourcing process ensuring quality and efficiency.', ctaPrimary: 'Start Sourcing', ctaSecondary: 'Learn More', bgImage: '/images/hero_bg.png' },
                process: {
                    title: 'Our 6-Step Sourcing Process',
                    steps: [
                        { id: '1', title: 'Requirement Analysis' },
                        { id: '2', title: 'Supplier Identification' },
                        { id: '3', title: 'Samples Evaluation' },
                        { id: '4', title: 'Pricing & Negotiation' },
                        { id: '5', title: 'Pre-shipment Quality Inspection' },
                        { id: '6', title: 'Shipment Logistics' },
                    ]
                }
            },
            industries: {
                hero: { title: 'Industries We Serve', subtitle: 'Providing sourcing and export expertise across diverse sectors.', ctaPrimary: 'View Specs', ctaSecondary: 'Contact Sales', bgImage: '/images/logistics_bg.png' },
                list: {
                    title: 'Global Sectors',
                    items: [
                        { id: '1', name: 'Textiles & Apparel', icon: '🧵' },
                        { id: '2', name: 'Pharmaceuticals (APIs)', icon: '💊' },
                        { id: '3', name: 'Building Materials', icon: '🏗️' },
                        { id: '4', name: 'Electronic Components', icon: '🔌' },
                    ]
                }
            },
            quality: {
                hero: { title: 'Quality & Packaging', subtitle: 'Ensuring global standards through rigorous inspection.', ctaPrimary: 'Our Standards', ctaSecondary: 'Request Audit', bgImage: '/images/hero_bg.png' },
                details: { title: 'Inspection Standards', description: 'Comprehensive quality check process for every shipment.', items: ['Factory Audits', 'Raw Material Verification', 'In-process Monitoring', 'Documentation Compliance'] }
            },
            logistics: {
                hero: { title: 'Logistics & Freight', subtitle: 'End-to-end freight management and export documentation support.', ctaPrimary: 'Track Shipment', ctaSecondary: 'Get Rates', bgImage: '/images/logistics_bg.png' },
                info: { title: 'Documentation & Support', description: 'Handling all critical export documents.', features: ['Packing List & B/L', 'Insurance Certificates', 'Export Licenses', 'Customs Clearance'], image: '/images/logistics_bg.png' }
            },
            contact: {
                info: { title: 'Get in Touch', responseTime: 'Average 24h response time', countries: 'Serving 100+ countries', email: 'info@abc-international.co.in', hours: 'Mon-Fri 9:00 AM - 6:00 PM IST', location: 'Mumbai, Maharashtra, India' }
            }
        },
        // Keep legacy content structure for home page compatibility
        content: {
            hero: { title: 'Your Trusted Merchant Exporter from India', subtitle: 'Global sourcing expertise backed by comprehensive logistics support.', ctaPrimary: 'Request Sourcing', ctaSecondary: 'Learn More', bgImage: '/images/hero_bg.png' },
            services: { title: 'What We Do', items: [{ id: 's1', title: 'Product Sourcing', description: 'Finding the best quality products.', icon: '📦' }, { id: 's2', title: 'Global Export', description: 'Seamless shipping worldwide.', icon: '🌐' }] },
            logistics: { title: 'Complete Logistics Management', description: 'Handling the complexities of international shipping.', features: ['Sea Freight', 'Customs Clearance'], image: '/images/logistics_bg.png' },
            industries: { title: 'Industries We Serve', items: [{ id: 'i1', name: 'Agri & Food', icon: '🌾' }] },
            quality: { title: 'Quality Assurance', description: 'Commitment to quality standards.', items: ['ISO 9001:2015'] },
            process: { title: 'Our Simple 5-Step Process', steps: [{ id: 'p1', title: 'Requirement Analysis' }] }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(defaultData);
            } catch (error) {
                console.error('Error fetching website data:', error);
                setData(defaultData);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, setData };
};
