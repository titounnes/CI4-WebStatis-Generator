---
title: Membuat Aplikasi Web Cbt Berbasis Google Spreadsheet (Versi GCP)
description: Membuat Aplikasi Web Cbt Berbasis Google Spreadsheet (Versi GCP)
author: #author#
email: #email#
date: 2021-11-14T14:41:38+07:00
tags: ["Google Apliccation script","Computer-based Test"]
slide_url:
featured_image: 
featured_video:
featured_url:
categories: 
thumbnail: /cbt/cbt.jpg 
draft: false
---

## Membuat Aplikasi Web Cbt Berbasis Google Spreadsheet Versi GCPhh


Secara umum aplikasi versi GCPmirip non GCP, namun lebih sederhana. Hal ini disebabkan, GCP bisa mendapatkan informasi email user secara langsung. Untuk memudahkan saya sudah memuat templatte yang bisa langsung dideploy.

> Untuk diskusi seputar instalasi dan cara menggunakan bisa bergabung dalam group telegram lewat tautan [Join Telegram](https://t.me/joinchat/4fffqQoyXyBiMzk1.)

### Menyiapkan Google Spreadsheet Sebagai Basis Data

Untuk menyiapkan google spreadsheet, langkahnya sebagai berikut.
1. Buka file master CBT di tautan [ini](https://docs.google.com/spreadsheets/d/1yr_CDbj2Ur9_dMsh6flU99JJAAd1p2RLNF9awNp6KaI/edit?usp=sharing)
1. Akan sebuah spreadsheet dengan status view only (hanya bisa melihat)
1. Buat salinan dengan cara 
    1. Klik File
    1. Make a copy (buat salinan)
    1. Isikan nama (terserah anda)
    1. Klik OK, amaka akan dibuka sebuah file baru yang bisa diedit
1. Pengaturan otorisasi
    1. Klik Tool (alat)
    1. Klik Script Editor (Editor skrip)
    1. Akan terbuka sebuah editor dan terdapat tonbol Run (Jalankan)
    1. Klik tombol Run (jalankan), maka akan muncul popup permintaan otorisasi
    1. Klik Review permission
    1. Jika muncul peringatan keamanan, klik advance
    1. Pilih akun gmail kita, scroll ke bawah akan ada tombol Allow (ijinkan)
    1. Klik Allow
1. Pengaturan Awal
    1. Kembali ke google spreadsheet, maka akan terlihat sebuah menu baru di sebelah kanan Help, yaitu eProject-CBT
    1. Klik tombol tersebut,  akan muncul sub menu CBT, 
    1. Klik sub menu CBT, akan muncul jendela instalasi, tunggu samapi muncul tu;isan "Database telah siap..."
    1. Maka akan terlihat pada sheet config beberapa informasi seperti email kita, ID Spreadsheet, Jenis lisensi dan token
    1. Pada sheet quiz terdapat beberapa contoh yang disiapkan (bisa dihapus jika tidak diinginkan)
    1. Pada sheet question terdapat beberapa contoh yang disiapkan (bisa dihapus jika tidak diinginkan)
    1. Pada answer quiz masih kosong
1. Lakukan Deploy Aplikasi 
    1. Kembali ke Script Editor, pada sisi kiri terdapat library (pustaka) LibCBT
    1. Klik 1 kali, dan pastikan version yang diigunakan adalah versi tertinggi (untuk saat ini versi 75)
    1. Lakukan Deploy dengan cara klik tombol Deploy (Terapkan)
    1. Pilih New Deployment 
    1. Pilih Web App
    1. isikan deskripsi (bebas)
    1. Execute as : pilih Me (akun gmail kita)
    1. Who has acces: 
        1. Jika kita mengijinkan semua pemilik akun google (umum maupun dalam organisasi kita) maka pilih: *Anyone with gogole account*
        1. Jika kita hanya mengijinkan pemilik akun dalam organisasi kita (Akun GCP)
 maka pilih *Anyone within [nama organisasi]*
    1. Klik Deploy
    1. Lalu click copy url pada bagian Web App (berupa tautan)
1. Mempercantik tautan
    1. karena tautan sangat sulit diingat kita bisa menggunakan penyingkat url seperti tinyurl, bit.ly dll
    1. Buka web peringkas tautan [tinyURL](//tinyurl.com)
    1. Salim URL hasil deploy ke kolom url
    1. Pada Kolom alias ketikan nama ringkas, misalkan CBT-SMA-XYZ
    1. Klik buat TinyURL
    1. Jika singaktan tersedia, maka singkatan siap digunakan
    1. Disarankan untuk memiliki akun tinyURL, sehingga nantinya kalau mau deploy ulang, bisa menggunakan alamat tinyURL yang sama 



Contoh apliksi yang sudah jadi klik tautan [ini](https://script.google.com/macros/s/AKfycbyKgDbyPE4GF718A_ux99FB7RTflq5f7JfRl6gGMiL32vfsXISM01lx2VVKZBvoALrJ/exec)