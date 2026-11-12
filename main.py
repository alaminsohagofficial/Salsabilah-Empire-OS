"""
Main Entry Point for Salsabilah-Empire-OS - SR Electronics Park Core Logic.
Developed by: MD. AL AMIN SOHAG
"""

from billing import create_professional_bill

def run_system():
    print("Initializing Salsabilah-Empire-OS...")
    print("Running SR Electronics Park Core Automation...")
    
    # Execute sample billing process for verification
    create_professional_bill("Global Client", "MyOne TV", 32500, 500)
    
    print("System execution completed successfully.")

if __name__ == "__main__":
    run_system()
