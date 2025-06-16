resource "google_compute" "vm" {
    name         = "llm-vm"
    machine_type = "e2-standard-4"
    zone         = "us-central1-a"
    
    boot_disk {
        initialize_params {
        image = "debian-cloud/debian-11"
        }
    }
    
    network_interface {
        network = "default"
        access_config {
        // Ephemeral IP
        }
    }
    
    metadata = {
        ssh-keys = "your-username:${file("~/.ssh/id_rsa.pub")}"
    }
    
    service_account {
        email  = google_service_account.default.email
        scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    }
}